import React from 'react';
import { Button, Result, Typography } from '@/UI';
import { useRouter } from 'next/router';

interface Props {
  error: Error;
  setError: () => void;
}

const { Paragraph } = Typography;

const FallBackUI: React.FC<Props> = ({ error, setError }) => {
  const router = useRouter();

  return (
    <Result
      status="500"
      title="An error occurred during execution."
      subTitle="If the error continues, please send the file
      Report the bug with the details below and the steps to reproduce the problem."
      className="w-[80%] mx-auto"
      extra={
        <div className="flex items-center justify-center gap-4">
          <Button
            type="primary"
            onClick={() => {
              setError();
              router.push('/');
            }}
          >
            Back home
          </Button>
        </div>
      }
    >
      <Paragraph>
        <pre>{error.stack.toString()}</pre>
      </Paragraph>
    </Result>
  );
};

export default FallBackUI;
