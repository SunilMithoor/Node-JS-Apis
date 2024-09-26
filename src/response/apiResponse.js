
function successJsonObject(statusCodeValue,successValue,messageValue,dataValue) {
    var data = {
        statusCode: statusCodeValue,
        success: successValue,
        message: messageValue,
        data: dataValue
    };
    return data
}

function failureJsonObject(statusCodeValue,successValue,messageValue,errorValue) {
    var data = {
        statusCode: statusCodeValue,
        success: successValue,
        message: messageValue,
        error:errorValue
    };
    return data
}

function serverErrorJsonObject(statusCodeValue,successValue,messageValue) {
    var data = {
        statusCode: statusCodeValue,
        success: successValue,
        message: messageValue
    };
    return data
}

module.exports = {
    successJsonObject,
    failureJsonObject,
    serverErrorJsonObject
}