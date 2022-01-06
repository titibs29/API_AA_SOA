local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'

local acc = {}


-- creer un compte
function acc.create(url, name, password)
    local urlString = url.."/acc/signin"
    local req = json.encode({name = name, password = password})
    local res = {}
    local clientId = 'nil'
    local body = {}

    local result, statuscode, headers, statustext = http.request {
        method = "POST",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    body = json.decode(table.concat(res))

    if statuscode == 201 then
        clientId = body.id
    end

    return statuscode, clientId
end


-- login
function acc.login(url, name, password)
    local urlString = url.."/acc/login"
    local req = json.encode({name = name, password = password})
    local res = {}
    local id = 'nil'
    local token = 'nil'
    local body = {}

    local result, statuscode, headers, statustext = http.request {
        method = "POST",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    if statuscode == 200 then
        body = json.decode(table.concat(res))
        id = body.id
        token = body.token

    end


    return statuscode, id, token


end


--afficher un compte
function acc.showOne(url, tokenSess, idToShow)
    local urlString = url.."/acc/"..idToShow
    local req = json.encode({token = tokenSess})
    local res = {}
    local name = 'nil'
    local role = 'nil'
    local body = {}

    local result, statuscode, headers, statustext = http.request {
        method = "GET",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    if statuscode == 200 then
    body = json.decode(table.concat(res))
    name = body.name
    role = body.role
    end

    return statuscode, name, role
end


--afficher tout les comptes
function acc.showAll(url, tokenSess)
    local urlString = url.."/acc/"

    local req = json.encode({token = tokenSess})
    local res = {}
    local body = {}

    local result, statuscode, headers, statustext = http.request {
        method = "GET",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    if statuscode == 200 then
    body = json.decode(table.concat(res))
    end

    return statuscode, body
end


-- modifier un compte
function acc.modify(url,tokenSess, idToChange, newName, newPassword, newRole)
    local modifyString = {token = tokenSess};
    if newName then
        modifyString.name = newName;
    end
    if newPassword then
        modifyString.password = newPassword;
    end
    if newRole then
        modifyString.role = newRole;
    end
    
    local urlString = url.."/acc/"..idToChange
    local req = json.encode(modifyString)
    local res = {}

    local result, statuscode, headers, statustext = http.request {
        method = "PUT",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    return statuscode
end


-- supprimer le compte
function acc.del(url, idToDel, tokenSess, idSess)
    if idToDel == 'nil' then
        error('id du compte a supprimer non fournie')

    elseif tokenSess == 'nil' then
        error('token null')

    elseif idSess == 'nil' then
        error('id du compte actif non fournie')
    else

    local urlString = url.."/acc/"..idToDel
    local req = json.encode({token = tokenSess, id = idSess})
    local res = {}

    local result, statuscode, headers, statustext = http.request {
        method = "DELETE",
        url = urlString,
        source = ltn12.source.string(req),
        headers={
            ["content-type"] = "application/json; charset=utf-8",
            ["content-length"] = tostring(#req)
        },
        sink = ltn12.sink.table(res)
    }

    return statuscode
    end
end

return acc