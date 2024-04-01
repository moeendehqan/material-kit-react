import { useLoginByUid } from 'src/api/query';
import { getCookie } from 'src/components/cookie/Cookie';

export function useCheckCookie() {
  const loginUid = useLoginByUid(getCookie('uid'));

  loginUid.mutateAsync()
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(0);
    });
}
