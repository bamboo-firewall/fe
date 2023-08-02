import { Button, Result } from '@/UI';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Trang không tồn tại."
        extra={
          <Link href="/" legacyBehavior>
            <Button type="primary">Quay lại trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
