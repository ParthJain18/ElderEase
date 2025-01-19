export default class BadRequest extends Error{
    constructor(message){
        super(message);
        this.name = 'BadRequest';
        this.message = message;
        this.status = 400;
    }
}