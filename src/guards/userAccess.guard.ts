// todo ######  -------> THIS GAURD MUST BE IMPROVED  <------- ######
import { useRouter } from 'vue-router';
import UserService from '../services/UserServices';
import { accessStore } from '../store';
const userAccess = async (to: any, from: any, next: any) => {
    try {
        const store =  accessStore();
        // const response = await UserService.getPermissions();
        const user = '';
        function getValidationUser(user:string) {
            switch (user) {
                case 'externo':
                    next('/home/correspondence/received-exu');
                    break;
                default:
                    next(); 
                    break;
            }
        }
        getValidationUser(user); 
    } catch (error:any) {
        console.error(error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        next('/login');
        throw error;
    }
};

export default userAccess;
