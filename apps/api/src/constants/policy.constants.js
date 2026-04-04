const DEFAULT_POLICY_EXCLUSIONS = [
  'No coverage for health insurance, hospitalization, or medical expenses.',
  'No coverage for life insurance or accidental death benefits.',
  'No coverage for vehicle repair, maintenance, puncture, fuel, or servicing costs.',
  'No payout for self-reported income loss unless linked to a valid parametric trigger event.',
  'No payout when the policy is inactive, expired, cancelled, or suspended.',
  'No duplicate payout for the same worker, same trigger event, and same coverage window.',
  'No payout if the worker is outside the covered city or configured operating zone at trigger time.',
  'No manual reimbursement for general financial hardship unrelated to covered disruption triggers.'
];

module.exports = {
  DEFAULT_POLICY_EXCLUSIONS
};