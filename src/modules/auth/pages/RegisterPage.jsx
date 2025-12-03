import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className='
      flex
      flex-col
      justify-center
      min-h-screen
      bg-neutral-100
      sm:items-center
      py-8
      px-4
      !bg-neutral-100
    '
    style={{ background: '#f5f5f5' }}
    >
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;