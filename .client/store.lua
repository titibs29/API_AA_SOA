local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'

local store = {}

-- afficher un article
function store.showOne(url, tokenSess, idToShow)
    local urlString = url.."/store/"..idToShow
    local req = json.encode({token = tokenSess})
    local res = {}
    local name = 'nil'
    local prix = 'nil'
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
        prix = tonumber(body.prix["$numberDecimal"],10)
        end
    
        return statuscode, name, prix
end

-- créer un article
function store.create(url, tokenSess, artName, descript, artPrix)
    local urlString = url.."/store/"
    local createString = {token = tokenSess, name = artName, desc = descript}
    if artPrix then
        createString.prix = artPrix;
    end
    local req = json.encode(createString)
    local res = {}
    local artId = 'nil'
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

    
    if statuscode == 201 or statuscode == 400 then
        body = json.decode(table.concat(res))
        artId = body.message
    end
    return statuscode, artId

end

-- modifier un article
function store.modify(url, tokenSess, idToChange, newName, newDesc, newPrix)
    local modifyString = {token = tokenSess};
    if newName then
        modifyString.name = newName;
    end
    if newDesc then
        modifyString.desc = newDesc;
    end
    if newRole then
        modifyString.prix = newPrix;
    end

    local urlString = url.."/store/"..idToChange
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

-- supprimer un article
function store.del(url, tokenSess, idToDel)

    local urlString = url.."/store/"..idToDel
    local req = json.encode({token = tokenSess})
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

-- afficher tout le magasin
function store.showAll(url)
    local urlString = url.."/store/"
    local res = {};
    local body = {};

    local result, statuscode, headers, statustext = http.request {
        method = "GET",
        url = urlString,
        headers={
            ["content-type"] = "application/json; charset=utf-8",
        },
        sink = ltn12.sink.table(res)
    }

    if statuscode == 200 then
        body = json.decode(table.concat(res));
    end

    return statuscode, body;
end

return store