// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
// https://www.tutorialspoint.com/http/http_status_codes.htm

module.exports = {
    // Informational
    continue: 100,
    switchingProtocols:101,
    // Success
    ok:200,
    created:201,
    accepted:202,
    nonAuthoritativeInformation:203,
    noContent:204,
    resetContent:205,
    partialContent:206,
    // Redirection
    multipleChoices:300,
    movedPermanently:301,
    found:302,
    seeOther:303,
    notModified:304,
    useProxy:305,
    unUsed:306,
    temporaryRedirect:307,
    // Client Error
    badRequest:400,
    unAuthorized:401,
    paymentRequired:402,
    forbidden:403,
    notFound:404,
    methodNotAllowed:405,
    notAcceptable:406,
    proxyAuthenticationRequired:407,
    requestTimeout:408,
    conflict:409,
    gone:410,
    lengthRequired:411,
    preconditionFailed:412,
    requestEntityTooLarge:413,
    requestUrlTooLong:414,
    unSupportedMediaType:415,
    requestedRangeNotSatisfiable:416,
    expectationFailed:417,
    // Server Error
    internalServerError:500,
    notImplemented:501,
    badGateway:502,
    serviceUnavailable:503,
    gatewayTimeout:504,
    hTTPVersionNotSupported:505
    
}
