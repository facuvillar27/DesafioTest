export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a string, recived ${user.first_name}
    * last_name : needs to be a string, recived ${user.last_name}
    * email : needs to be a string, recived ${user.email}
    * age : needs to be a number, recived ${user.age}
    * password : needs to be a string, recived ${user.password}`;
}