function commonResponse(res, condition, data, sucessMessage, errorMessage, code) {
    res.json({
        success: condition ? true : false,
        code: condition ? 200 : 400,
        message: condition ? sucessMessage : errorMessage,
        data,
    })
};

module.exports = {
    commonResponse,
};