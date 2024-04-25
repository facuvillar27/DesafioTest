import Errors from "../../services/enum.js";
export default (error, req, res, next) => {
    console.log(error);
    switch (error.code) {
        case Errors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
            break;
        default:
            res.send({status: "error", error: "Unhandled error"})
    }
}
