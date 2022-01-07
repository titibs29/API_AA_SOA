local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'

local book = {}

    -- affiche les réservations associées à un utilisateur
    function book.showByAcc(url, tokenSess, idToSearch)
        local urlString = url.."/book/byAcc/"..idToSearch
        local req = json.encode({token = tokenSess})
        local res = {};
        local body = {};
        local firstItem = {};

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
            firstItem = body[1]

        end 

        return statuscode, firstItem
    end

    -- affiche une réservation
    function book.showOne(url, tokenSess, idToShow)
        local urlString = url.."/book/"..idToShow
        local req = json.encode({token = tokenSess})
        local res = {};
        local body = {};
        local bookDate = nil;
        local partList = nil;

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
            bookDate = body.date
            partList = body.participants
        end 

        return statuscode, bookDate, partList

    end

    -- crée une reservation
    function book.create(url, tokenSess, bookDate, ...)
        local urlString = url.."/book/"
        local createString = {token = tokenSess, date = bookDate, participants = {}}
        
        for k in ipairs(arg) do
            createString.participants[k] = arg[k]
        end
        local req = json.encode(createString)
        local res = {};
        local bookId = nil;
        local body = {};

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
            bookId = body.message
        end 

        return statuscode, bookId

    end

    -- modifie une réservation
    function book.modify(url, tokenSess, idToModify, bookDate, ...)
        local urlString = url.."/book/"..idToModify
        local modifyString = {token = tokenSess, date = bookDate, participants = {}}
        for k in ipairs(arg) do
            modifyString.participants[k] = arg[k]
        end
        local req = json.encode(modifyString)
        local res = {};

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

    -- supprime une réservation
    function book.del(url, tokenSess, idToDel)
        local urlString = url.."/book/"..idToDel
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

return book