import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp:string
}

export function EmailTemplate({ username,otp }: EmailTemplateProps) {
  return (
    <div>
        <title>Verification Code</title>

        <h1>Welcome, {username}!</h1>
        <br/>
        <p>Your verification code is <span className='font-semibold'>{otp}</span></p>
    </div>
  );
}