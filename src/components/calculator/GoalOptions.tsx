import { financialGoals, goalGroups } from '@/data/financialGoals';

export default function GoalOptions({useKeys=false}: {useKeys?: boolean}) {
  return <>{goalGroups.map(group=><optgroup key={group} label={group}>{financialGoals.filter(goal=>goal.group===group).map(goal=><option key={goal.key} value={useKeys?goal.key:goal.name}>{goal.name}</option>)}</optgroup>)}</>;
}
