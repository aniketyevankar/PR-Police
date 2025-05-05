import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { email, token, domain } = await req.json();

    if (!email || !token || !domain) {
      return new Response(
        JSON.stringify({ error: 'Email, token and domain are required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate the JIRA domain format
    if (!domain.match(/^[a-zA-Z0-9-]+\.atlassian\.net$/)) {
      return new Response(
        JSON.stringify({ error: 'Invalid JIRA domain format' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const jiraResponse = await fetch(`https://${domain}/rest/api/3/myself`, {
      headers: {
        'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
        'Accept': 'application/json'
      }
    });

    const isValid = jiraResponse.ok;
    const responseData = { isValid };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error validating JIRA token:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to validate JIRA token',
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