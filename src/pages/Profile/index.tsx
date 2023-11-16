
import { AiFillSetting } from 'react-icons/ai'
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import './style.css'
import { FiUpload } from 'react-icons/fi';
import avatarImg from '../../assets/avatar.png'
import { CustomButton } from '../../components/CustomButton';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

interface HTMLInputEvent extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

export const Profile = () => {

  const { user, cookieUser, setUser, deleteUser, updateUser } = useContext(AuthContext);


  interface User {
    name: string;
    email: string;
  }
  const [infoUser, setInfoUser] = useState({
    name: '',
    email: '',
  });;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (user) {
      setInfoUser({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();

    if (user) {
      const id = user.id;
      const name = infoUser.name;
      const email = infoUser.email;

      await updateUser({ id, name, email });
      setIsActive(false);
    }

  }

  const handleDeleteAccount = () => {
    if (user) {
      deleteUser(user.id);
    }
  }

  return (
    <div className='profile-container'>
      <Sidebar />
      <div className='main-content'>
        <Title name='Meu perfil' title='Editar minhas informações' setIsActive={setIsActive}>

          <AiFillSetting size={24} />

        </Title>

        <div className='profile-content'>

          <form className="form-profile">
            <div className='profile-info'>
              <div>
                <label>Nome</label>
                <input type="text" value={infoUser.name} onChange={(e) =>
                  setInfoUser({ ...infoUser, name: e.target.value })} disabled={!isActive} />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={infoUser.email}
                  disabled={!isActive}
                  onChange={(e) =>
                    setInfoUser({ ...infoUser, email: e.target.value })}
                />
              </div>
            </div>

            <CustomButton type="submit" disabled={!isActive} onClick={handleUpdateUser}>Salvar</CustomButton>
          </form>

        </div>

        <div className='profile-footer'>
          <CustomButton type="submit" onClick={handleDeleteAccount}>
            Excluir conta
          </CustomButton>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>

  )
}