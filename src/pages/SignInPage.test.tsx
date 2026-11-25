import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const auth = vi.hoisted(()=>({ signInWithOtp:vi.fn(), verifyOtp:vi.fn(), signInWithOAuth:vi.fn() }));
vi.mock('@/lib/auth',()=>({authClient:{auth}}));
import SignInPage from './SignInPage';
afterEach(cleanup);
beforeEach(()=>{vi.clearAllMocks();auth.signInWithOtp.mockResolvedValue({error:null});auth.verifyOtp.mockResolvedValue({data:{session:null},error:new Error('Invalid verification code')});});
describe('mobile OTP sign-in',()=>{
  it('shows the interactive demo below the brand and opens it from the header',()=>{
    const onDemo=vi.fn();
    render(<SignInPage onDemo={onDemo}/>);
    const demo=screen.getByRole('link',{name:'Interactive demo'});
    expect(demo.closest('header')).toBeInTheDocument();
    expect(demo.previousElementSibling).toHaveClass('cf-brand');
    expect(demo).toHaveAttribute('href','/demo');
    fireEvent.click(demo);
    expect(onDemo).toHaveBeenCalledOnce();
    expect(screen.queryByText('Want to see how it works?')).not.toBeInTheDocument();
  });
  it('keeps the public preview visible when the account-free planner demo is disabled',()=>{
    render(<SignInPage/>);
    expect(screen.getByRole('link',{name:'Interactive demo'})).toHaveAttribute('href','/demo');
  });
  it('sends to the normalized number and verifies against the same destination',async()=>{
    render(<SignInPage/>);
    fireEvent.change(screen.getByLabelText('Mobile number'),{target:{value:'9876543210'}});
    fireEvent.click(screen.getByRole('button',{name:'Get verification code'}));
    await waitFor(()=>expect(auth.signInWithOtp).toHaveBeenCalledWith({phone:'+919876543210'}));
    const code=await screen.findByLabelText(/Code sent to/);
    fireEvent.change(code,{target:{value:'123456'}});
    fireEvent.click(screen.getByRole('button',{name:'Verify and continue'}));
    await waitFor(()=>expect(auth.verifyOtp).toHaveBeenCalledWith({phone:'+919876543210',token:'123456',type:'sms'}));
    await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Invalid verification code'));
    expect(screen.getByRole('button',{name:/resend in/i})).toBeDisabled();
  });
  it('shows provider errors without advancing to verification',async()=>{
    auth.signInWithOtp.mockResolvedValue({error:new Error('SMS unavailable')});
    render(<SignInPage/>);
    fireEvent.change(screen.getByLabelText('Mobile number'),{target:{value:'9876543210'}});
    fireEvent.click(screen.getByRole('button',{name:'Get verification code'}));
    await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('SMS unavailable'));
    expect(screen.queryByLabelText(/Code sent to/)).not.toBeInTheDocument();
  });
});
