import { memo, FC, useMemo } from 'react';
import { Badge, BadgeProps } from 'antd';

interface IStatusBadgeProps extends BadgeProps {
  autoStatus: string;
}

const StatusBadge: FC<IStatusBadgeProps> = (props) => {
  const { autoStatus, text } = props || {};

  const autoColor = useMemo(() => {
    if (['1'].includes(autoStatus)) {
      return 'yellow';
    } else if (['2'].includes(autoStatus)) {
      return 'green';
    } else if (['3'].includes(autoStatus)) {
      return 'blue';
    }
  }, [autoStatus]);

  return <Badge color={autoColor} text={text} />;
};

export default memo(StatusBadge);
