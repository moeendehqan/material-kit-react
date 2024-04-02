import { useState,  useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import {useLogin, useCaptcha, useLoginByUid, useApplyCaptcha} from 'src/api/query';

import Button from '@mui/material/Button';

import { MuiOtpInput } from 'mui-one-time-password-input'

import { getCookie, setCookie } from 'src/components/cookie/Cookie';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import Alert from '@mui/material/Alert';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [otp, setOtp] = useState('');
  const [alert, setAlert] = useState({ msg: '', type: '' });
  const [step, setStep] = useState(1);
  const [CheckCookieState, setCheckCookieState] = useState(false);

  const { data: capctha, isLoading: isLoadingCapctha, refetch: refetchCaptcha } = useCaptcha();
  const applyCaptcha = useApplyCaptcha(phone, captcha, capctha);
  const Login = useLogin(phone, otp);


  const handleRefreshCaptcha = async () => {
    await refetchCaptcha();
  };

  const handleCaptcha = () => {
    if (step===1) {
      
      const mobileNumberPattern = /^09\d{9}$/;
      if (!mobileNumberPattern.test(phone)) {
        setAlert({ msg: 'شماره همراه صحیح نیست', type: 'warning' });
      }
      if (captcha.length !== 4) {
        setAlert({ msg: 'کپچا صحیح نیست', type: 'warning' });
      } else {
        setAlert({ msg: '', type: 'info' });
        applyCaptcha
        .mutateAsync()
        .then((response) => {
          setStep(2);
        })
        .catch((erorr) => {
          if (erorr.response.data.message) {
            const firstErorr = Object.keys(erorr.response.data.message)[0];
            setAlert({ msg: erorr.response.data.message[firstErorr], type: 'error' });
          } else {
            setAlert({ msg: erorr, type: 'error' });
          }
        });
      }
    }else{
      const lenddOtp = 4
      if (otp.length!==lenddOtp) {
        setAlert({ msg: 'کد تایید صحیح نیست', type: 'warning' });
      }else{
        Login.mutateAsync()
        .then(response=>{
          setCookie('uid',response._id,10)
          router.push('/');
        })
        .catch(erorr=>{
          if (erorr.response.data.message) {
            const firstErorr = Object.keys(erorr.response.data.message)[0];
            setAlert({ msg: erorr.response.data.message[firstErorr], type: 'error' });
          } else {
            setAlert({ msg: erorr, type: 'error' });
          }
        })
      }
    }
  };


  const uid = getCookie('uid')

  const loginUid = useLoginByUid(uid);
  function CheckCookie() {
    if (!CheckCookieState && uid.length>0) {
      setCheckCookieState(true)
      loginUid.mutateAsync()
        .then(response => {
          setCookie('uid',response.id,10)
          router.push('/');
        })
        .catch(error => {
          setCookie('uid','',0)
        });

    }
  }
  

  useEffect(CheckCookie, [loginUid,CheckCookieState,router,uid]);
  
  const renderForm = (
    <>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <TextField
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          name="phone"
          label="شمار همراه"
          disabled={step !== 1}
        />

        {step === 1 ? (
          <>
            <TextField
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              name="captcha"
              label="کپچا"
            />
            {isLoadingCapctha ? (
              <Skeleton variant="rounded" width="100%" height={60} />
            ) : (
              <Button
                onClick={handleRefreshCaptcha}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={`data:image/png;base64,${capctha.image}`} alt="کد کپچا" />
              </Button>
            )}
          </>
        ) : (
          <>
                    <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              کد تایید
            </Typography>
          </Divider>
          <dir dir='ltr'>
          <MuiOtpInput value={otp} onChange={setOtp} />

          </dir>
          </>
        )}

        {alert.msg ? (
          <Alert
            sx={{ cursor: 'pointer' }}
            onClick={() => setAlert({ msg: '', type: 'info' })}
            severity={alert.type}
          >
            {alert.msg}
          </Alert>
        ) : null}
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleCaptcha}
      >
        تایید
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">ورود / ثبت نام</Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              میز کار
            </Typography>
          </Divider>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
