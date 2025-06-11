/*
  # Add Sample Precedent Cases

  This migration adds sample legal cases to the precedent_cases table
  to demonstrate the AI functionality.

  1. Sample Cases
    - Employment discrimination cases
    - Contract disputes
    - Personal injury cases
    - Intellectual property cases
  
  2. Data Structure
    - Complete case information with embeddings
    - Realistic legal scenarios
    - Proper citations and outcomes
*/

-- Insert sample employment discrimination cases
INSERT INTO precedent_cases (
  title, citation, court, year, jurisdiction, case_summary, key_facts, 
  legal_issues, outcome, damages, full_text, metadata
) VALUES 
(
  'Johnson v. MegaCorp Industries',
  '542 F.3d 891 (9th Cir. 2018)',
  '9th Circuit Court of Appeals',
  2018,
  'Federal',
  'Employee filed discrimination complaint, received negative performance review shortly after, then was terminated. Court found temporal proximity established prima facie case of retaliation.',
  'Employee filed internal harassment complaint on January 15. HR investigation concluded February 28. Performance review conducted March 15 showing sudden decline. Termination occurred April 10 citing performance issues.',
  'Employment discrimination, retaliation, wrongful termination, temporal proximity, pretext analysis',
  'Plaintiff Victory - $285,000 damages awarded',
  '$285,000',
  'Full case text would go here...',
  '{"case_type": "employment", "practice_area": "discrimination", "key_precedent": true}'
),
(
  'Davis v. Global Tech Solutions',
  '398 F.Supp.3d 445 (S.D.N.Y. 2019)',
  'Southern District of New York',
  2019,
  'Federal',
  'Sexual harassment case where company failed to properly investigate complaints. Settlement reached after discovery revealed pattern of inadequate HR responses.',
  'Multiple complaints filed over 6-month period. HR conducted minimal investigation. Witnesses not properly interviewed. Company failed to take corrective action.',
  'Sexual harassment, hostile work environment, inadequate investigation, employer liability',
  'Settlement - $150,000',
  '$150,000',
  'Full case text would go here...',
  '{"case_type": "employment", "practice_area": "harassment", "settlement": true}'
),
(
  'Wilson v. Enterprise Systems',
  '721 F.3d 234 (5th Cir. 2020)',
  '5th Circuit Court of Appeals',
  2020,
  'Federal',
  'Age discrimination case involving layoffs. Company claimed economic reasons but statistical analysis showed disproportionate impact on older workers.',
  'Company-wide layoffs affected 60% of workers over 50 but only 20% of workers under 40. Plaintiff had excellent performance reviews prior to layoff.',
  'Age discrimination, disparate impact, ADEA violation, statistical evidence, pretext',
  'Plaintiff Victory - $320,000 damages awarded',
  '$320,000',
  'Full case text would go here...',
  '{"case_type": "employment", "practice_area": "age_discrimination", "statistical_evidence": true}'
),
(
  'Martinez v. Construction Corp',
  '456 F.Supp.2d 789 (C.D. Cal. 2017)',
  'Central District of California',
  2017,
  'Federal',
  'Personal injury case involving construction site accident. Employer failed to provide proper safety equipment and training.',
  'Worker fell from scaffolding due to missing safety rails. OSHA investigation found multiple violations. Company had history of safety violations.',
  'Personal injury, workplace safety, OSHA violations, employer negligence, premises liability',
  'Plaintiff Victory - $1,200,000 damages awarded',
  '$1,200,000',
  'Full case text would go here...',
  '{"case_type": "personal_injury", "practice_area": "workplace_safety", "osha_violations": true}'
),
(
  'TechStart Inc. v. Innovation Labs',
  '789 F.3d 123 (Fed. Cir. 2019)',
  'Federal Circuit',
  2019,
  'Federal',
  'Patent infringement case involving software algorithms. Court found willful infringement and awarded enhanced damages.',
  'Defendant copied patented algorithm after licensing negotiations failed. Internal emails showed knowledge of patent. Continued use despite cease and desist.',
  'Patent infringement, willful infringement, enhanced damages, software patents',
  'Plaintiff Victory - $2,500,000 damages awarded',
  '$2,500,000',
  'Full case text would go here...',
  '{"case_type": "intellectual_property", "practice_area": "patent", "willful_infringement": true}'
),
(
  'Smith v. Retail Giant Corp',
  '234 F.Supp.3d 567 (E.D. Va. 2018)',
  'Eastern District of Virginia',
  2018,
  'Federal',
  'Contract dispute over exclusive distribution agreement. Court found material breach and awarded expectation damages.',
  'Five-year exclusive distribution agreement. Defendant began selling through competitors in year three. Plaintiff lost significant market share.',
  'Contract breach, exclusive dealing, expectation damages, lost profits, material breach',
  'Plaintiff Victory - $850,000 damages awarded',
  '$850,000',
  'Full case text would go here...',
  '{"case_type": "contract", "practice_area": "commercial", "exclusive_dealing": true}'
),
(
  'Green v. Medical Center',
  '345 F.Supp.2d 678 (N.D. Ill. 2020)',
  'Northern District of Illinois',
  2020,
  'Federal',
  'Medical malpractice case involving misdiagnosis. Hospital failed to follow standard protocols leading to delayed treatment.',
  'Patient presented with chest pain. Initial tests were misread. Standard cardiac protocols not followed. 6-hour delay in proper treatment.',
  'Medical malpractice, misdiagnosis, standard of care, hospital liability, delayed treatment',
  'Plaintiff Victory - $750,000 damages awarded',
  '$750,000',
  'Full case text would go here...',
  '{"case_type": "medical_malpractice", "practice_area": "healthcare", "misdiagnosis": true}'
),
(
  'Brown v. Insurance Solutions',
  '567 F.3d 890 (3rd Cir. 2019)',
  '3rd Circuit Court of Appeals',
  2019,
  'Federal',
  'Bad faith insurance case. Insurer denied valid claim without reasonable investigation.',
  'Policyholder filed claim for water damage. Insurer denied without sending adjuster. Internal documents showed cost-cutting directive to deny claims.',
  'Insurance bad faith, unreasonable denial, punitive damages, duty to investigate',
  'Plaintiff Victory - $450,000 compensatory, $200,000 punitive',
  '$650,000',
  'Full case text would go here...',
  '{"case_type": "insurance", "practice_area": "bad_faith", "punitive_damages": true}'
);

-- Note: Embeddings will be generated when cases are processed through the AI system
-- The embedding column will be populated by the Edge Functions when they process these cases