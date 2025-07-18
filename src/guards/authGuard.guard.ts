import { accessStore } from '../store/index.ts';
//*GUARD ACCESS TO GENERAL VIEWS -- WITHOUT TENANT DEFINED : AUTH
const authGuard = async (to :any, from :any, next:any) => {
  const store = accessStore();//TODO Call the instance con accesStore

  //TODO Initialize the store for get actual values of him.
  await store.initializeStore();
  //TODO We will wait to update the data store and get boolean if they get data or are null.
  const isAuthenticated = await store.isAuthenticated();
  //? Validation if acces and refresh token of store has some value.
  if (isAuthenticated) {
    next(); //TODO let access 
  } else {

    next('/'); //TODO Redirect to principal view : login 
  }
};

export default authGuard;
