local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'

local pi = {}

-- affiche un pi
function pi.showOne(url, idToShow)
    local urlString = url.."/pi/"..idToShow
    local req = ''
    local res = {}
    local name = 'nil'
    local desc_fr = 'nil'
    local desc_en = 'nil'
    local artAssoc = 'nil'
    local coordX = nil
    local coordY = nil
    local videoUrl = 'nil'
    local body = {}

    local result, statuscode, headers, statustext = http.request {
        method = "GET",
        url = urlString,
        headers={
            ["content-type"] = "application/json; charset=utf-8"
        },
        sink = ltn12.sink.table(res)
    }

    if statuscode == 200 then
        body = json.decode(table.concat(res))
        name = body.name
        desc_fr = body.desc_fr
        desc_en = body.desc_en
        artAssoc = body.artisan
        coordX = tonumber(body.x["$numberDecimal"],10)
        coordY = tonumber(body.y["$numberDecimal"],10)
        videoUrl = body.video
    end

    return statuscode, name, artAssoc, coordX, coordY, desc_fr, desc_en, videoUrl

end    

-- crée un pi
function pi.create(url, tokenSess, newName, coordX, coordY, descript_fr, descript_en, videoUrl, artisanId)
    local urlString = url.."/pi/"
    local createString = {token = tokenSess, name = newName, desc_fr = descript_fr, x = coordX, y = coordY}
    if descript_en then
        createString.desc_en = descript_en;
    end
    if videoUrl then
        createString.video = videoUrl;
    end
    if artisanId then
        createString.artisan = artisanId;
    end
    local req = json.encode(createString)
    local res = {}
    local piId = 'nil'
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
        piId = body.message
    end

    return statuscode, piId
end 

-- modifie un pi
function pi.modify(url, tokenSess, idToChange, newName, coordX, coordY, descript_fr, descript_en, videoUrl, artisanId)
    local modifyString = {token = tokenSess};
    if newName then
        modifyString.name = newName;
    end
    if coordX then
        modifyString.x = coordX
    end
    if coordY then
        modifyString.y = coordY
    end
    if descript_fr then
        modifyString.desc_fr = descript_fr;
    end
    if descript_en then
        modifyString.desc_en = descript_en;
    end
    if videoUrl then
        modifyString.video = videoUrl;
    end
    if artisanId then
        modifyString.artisan = artisanId;
    end
    local urlString = url.."/pi/"..idToChange
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

-- supprime un pi
function pi.del(url, tokenSess, idToDel)

    local urlString = url.."/pi/"..idToDel
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

-- affiche la liste
function pi.showAll(url)
    local urlString = url.."/pi/"
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

return pi