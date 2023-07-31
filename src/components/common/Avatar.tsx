import React from 'react';
import { Avatar } from '@/UI';
import { useAuth } from '@/provider/AppProvider';

interface Props {
  size?: number;
  textSize?: string;
}

export const AvatarApp: React.FC<Props> = ({ size, textSize }) => {
  const { userInfo } = useAuth();

  const getAvatarName = (name: string) => {
    if (!name) return '';

    const arrSubStr = name.split(' ');
    if (arrSubStr.length >= 2) {
      const firstChars = arrSubStr.map((item) => item.charAt(0));
      return (firstChars[0] + firstChars[1]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Avatar className="bg-green-600" size={size}>
      <span className={textSize}>{getAvatarName(userInfo?.name)}</span>
    </Avatar>
  );
};
