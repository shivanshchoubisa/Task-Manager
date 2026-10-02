import { PRIORITY_OPTIONS, STATUS_OPTIONS, labelOf } from '../utils/constants';

export default function Badge({ type, value }) {
  const options = type === 'status' ? STATUS_OPTIONS : PRIORITY_OPTIONS;
  return (
    <span className={`badge badge-${type}-${value}`}>{labelOf(options, value)}</span>
  );
}