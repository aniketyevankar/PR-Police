import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Extract JIRA ticket ID from PR description
function extractJiraTicketId(description: string): string | null {
  const match = description.match(/^([A-Z]+-\d+):/);
  return match ? match[1] : null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const {
      prNumber,
      repositoryId,
      repositoryOwner,
      repositoryName,
      githubToken,
      jiraToken,
      jiraDomain,
      jiraEmail,
      openAiToken
    } = await req.json();

    // Validate required parameters
    if (!prNumber || !repositoryId || !repositoryOwner || !repositoryName || 
        !githubToken || !jiraToken || !jiraDomain || !jiraEmail || !openAiToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 1. Fetch PR details from GitHub
    const prResponse = await fetch(
      `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/pulls/${prNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!prResponse.ok) {
      throw new Error(`Failed to fetch PR: ${prResponse.statusText}`);
    }

    const prData = await prResponse.json();
    const jiraTicketId = extractJiraTicketId(prData.body || '');

    if (!jiraTicketId) {
      throw new Error('No JIRA ticket ID found in PR description. Format should be "TICKET-123: Description"');
    }

    // 2. Fetch PR diff
    const diffResponse = await fetch(
      `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/pulls/${prNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3.diff'
        }
      }
    );

    if (!diffResponse.ok) {
      throw new Error(`Failed to fetch PR diff: ${diffResponse.statusText}`);
    }

    const prDiff = await diffResponse.text();

    // 3. Fetch JIRA ticket details
    const jiraResponse = await fetch(
      `https://${jiraDomain}/rest/api/3/issue/${jiraTicketId}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(`${jiraEmail}:${jiraToken}`)}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!jiraResponse.ok) {
      throw new Error(`Failed to fetch JIRA ticket: ${jiraResponse.statusText}`);
    }

    const jiraData = await jiraResponse.json();

    // 4. Use OpenAI to analyze the correlation
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing pull requests and JIRA tickets. Your task is to:
              1. Determine how well the changes in a pull request align with the requirements in a JIRA ticket
              2. Provide a confidence score between 0 and 1 (1 means perfect alignment)
              3. List specific findings that support your score
              4. Identify any potential misalignments or concerns
              
              Format your response as JSON with the following structure:
              {
                "confidence_score": number,
                "summary": "Brief summary of analysis",
                "findings": ["List of specific findings"],
                "concerns": ["List of concerns or misalignments"]
              }`
          },
          {
            role: 'user',
            content: `
              JIRA Ticket (${jiraTicketId}):
              Title: ${jiraData.fields.summary}
              Description: ${jiraData.fields.description}
              
              Pull Request Changes:
              ${prDiff}
            `
          }
        ]
      })
    });

    if (!openAiResponse.ok) {
      throw new Error(`Failed to analyze with OpenAI: ${openAiResponse.statusText}`);
    }

    const openAiData = await openAiResponse.json();
    const analysis = JSON.parse(openAiData.choices[0].message.content);

    // 5. Store the validation results in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('pr_validations')
      .insert({
        pr_number: prNumber,
        repository_id: repositoryId,
        jira_ticket_id: jiraTicketId,
        confidence_score: analysis.confidence_score,
        findings: {
          summary: analysis.summary,
          findings: analysis.findings,
          concerns: analysis.concerns,
          jira_summary: jiraData.fields.summary,
          jira_description: jiraData.fields.description,
          pr_diff: prDiff
        }
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store validation results: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        validation_id: data.id,
        jira_ticket_id: jiraTicketId,
        confidence_score: analysis.confidence_score,
        summary: analysis.summary,
        findings: analysis.findings,
        concerns: analysis.concerns
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error validating PR:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to validate PR',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});