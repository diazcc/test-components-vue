const UserValidators = {
    validationRemitter(remitter: any) {
        let ans: any = "";
        if (!remitter) {
            ans =  "anonymous_person";
        } else if (remitter.contact_name) {
            ans = remitter.contact_name;
        } else if (remitter.first_name && remitter.last_name) {
            ans = `${remitter.first_name} ${remitter.last_name}`;
        } else if (remitter.addressee) {
            ans =  remitter.addressee;
        } else {
            ans = remitter.email || "anonymous_person";
        }

        return ans;
    }
}

export default UserValidators;