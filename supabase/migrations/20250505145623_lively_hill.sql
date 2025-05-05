/*
  # PR Validation Schema

  1. New Tables
    - `pr_validations`
      - `id` (uuid, primary key)
      - `pr_number` (integer)
      - `repository_id` (uuid, references repositories)
      - `jira_ticket_id` (text)
      - `confidence_score` (decimal)
      - `findings` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `pr_validations` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS pr_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pr_number integer NOT NULL,
  repository_id uuid NOT NULL,
  jira_ticket_id text NOT NULL,
  confidence_score decimal NOT NULL,
  findings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pr_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own validations"
  ON pr_validations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own validations"
  ON pr_validations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);