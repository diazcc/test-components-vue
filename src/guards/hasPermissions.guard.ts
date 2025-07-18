const hasPermissions = {
    validator(permission: any) {
        const permits: any = getPermits()?.split(',');    
        return permits ? permits.includes(permission) : false;
    }, 
}

function getPermits() {
    return localStorage.getItem('permits');
}

export default hasPermissions;
