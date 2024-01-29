import userModel from "../models/user.models.js";

export default class UserDB {

    constructor() {

    }

    getOne = async (email, password) => await userModel.find({ email: email, password: password });

    getOne = async (obj) => await userModel.find({ _id: obj._id });

    getOneId = async (id) => await userModel.find({ _id: id });

    findEmail = async (email) => await userModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password: 1 }).lean();

    existEmail = async (email, password) => await userModel.exists({ email: email });

    updateUser = async (obj) => await userModel.updateOne({ _id: obj._id }, obj);

    existEmailPass = async (email, password) => await userModel.exists({ email: email, password: password });

    //createOne = async (obj) => await (this.existEmail(obj.email)) ? null : userModel.create(obj);
    createOne = async (obj) => await userModel.create(obj);

}