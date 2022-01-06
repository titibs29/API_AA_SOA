--executer avec ctrl+shift+b ou via terminal > executer la tache > run lua
--#region appel à la librairie socket locale
package.path = package.path..';./.client/libs/lua/?.lua'
package.cpath = package.cpath..';./.client/libs/socket/?.dll;./libs/mime/?.dll'

local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'
--#endregion


local url = 'http://localhost:3000' --url a appeler


-- connexion
function connect(url)
    local body, statuscode, headers, statustext = http.request(url)
    return statuscode
end


    -- creer un compte
    function acc_create(url, name, password)
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
            clientId = body.userId
        end
  
        return statuscode, clientId
    end


    -- login
    function acc_login(url, name, password)
        local urlString = url.."/acc/login"
        local req = json.encode({name = name, password = password})
        local res = {}
        local userId = 'nil'
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
            userId = body.userId
            token = body.token

        end


        return statuscode, userId, token


    end


    --afficher un compte
    function acc_showOne(url, tokenSess, idToShow)
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
    function acc_showAll(tokenSess)
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
    function acc_modify(url,tokenSess, idToChange, newName, newPassword, newRole)
        local modifyString = {token = tokenSess, id = idToChange};
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
    function acc_del(url, idToDel, tokenSess, idSess)
        if idToDel == 'nil' then
            error('id du compte à supprimer non fournie')

        elseif tokenSess == 'nil' then
            error('token null')

        elseif idSess == 'nil' then
            error('id du compte actif non fournie')
        else

        local urlString = url.."/acc/"..idToDel
        local req = json.encode({token = tokenSess, userId = idSess})
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




--[[ début de la zone de test ]]
local lu = require('luaunit')

Begin = {}

    -- simple test de connexion
    function Begin:test1()
        local status = 0;
        status = connect(url);
        lu.assertEquals(status, 403);
    end

TestAccount = {}

    function TestAccount:setUp()

        local clientId1 = 'nil';
        local clientId2 = 'nil';
        local adminId = 'nil';
        local tokenSess1 = 'nil';
        local tokenSess2 = 'nil';
        local tokenSessAdmin = 'nil';

    end


    -- création de deux compte clients
    function TestAccount:test1a()
        local status = 0;
        status, clientId1 = acc_create(url, "luacreate", "luapassword" );
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
    end
    function TestAccount:test1b()
        local status = 0;
        status, clientId2 = acc_create(url, "luasecond", "secondpass");
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
        
    end


    -- creation de 3 sessions
    function TestAccount:test2a()
        local status = 0;
        status, adminId, tokenSessAdmin = acc_login(url, "admin", "admin" ); -- session admin
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2b()
        local status = 0;
        status, clientId1, tokenSess1 = acc_login(url, "luacreate", "luapassword" ); -- session client 1
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2c()
        local status = 0;
        status, clientId2, tokenSess2 = acc_login(url, "luasecond", "secondpass" ); -- session client 2
        lu.assertEquals( status, 200);
    end


    -- affiche l'utilisateur
    function TestAccount:test3a()
        local status = 0;
        local name = 'nil';
        status, name = acc_showOne(url, tokenSess1, clientId1); -- par son proprio
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end
    function TestAccount:test3b()
        local status = 0;
        local name = 'nil';
        status, name = acc_showOne(url, tokenSess2, clientId1); -- par un autre client
        lu.assertEquals(status, 403);
        lu.assertEquals(name, 'nil');
        
    end
    function TestAccount:test3c()
        local status = 0;
        local name = 'nil';
        status, name = acc_showOne(url, tokenSessAdmin, clientId1); -- par un admin
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end

    -- modification d'un compte
    function TestAccount:test4a()
        local status = 0;
        local statusTwo = 0;
        local name = 'nil';
        local role = 3;
        status = acc_modify(url,tokenSess1, clientId1, "newname", "newPass",1); -- par son proprio
        statusTwo, name, role = acc_showOne(url, tokenSess1, clientId1) -- on verifie
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newname");
        lu.assertEquals(role, 2);
    end
    function TestAccount:test4b()
        local status = 0;
        status = acc_modify(url,tokenSess1, clientId2, "newname", "newPass",1); -- par un autre client
        lu.assertEquals(status, 403);
    end
    function TestAccount:test4c()
        local status = 0;
        local statusTwo = 0;
        local name = 'nil';
        local role = 3;
        status = acc_modify(url,tokenSessAdmin, clientId1, "newnametwo", "newPasstwo",1); -- par un admin
        statusTwo, name, role = acc_showOne(url, tokenSess1, clientId1) -- on verifie
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newnametwo");
        lu.assertEquals(role, 1);
    end
    


    -- affichage de toute la base
    function TestAccount:test5a()
        local status = 0;
        status = acc_showAll(tokenSess1); -- avec un compte client
        lu.assertEquals(status, 403);
    end
    function TestAccount:test5b()
        local status = 0;
        status = acc_showAll(tokenSessAdmin); -- avec un compte admin
        lu.assertEquals(status, 200);
    end


-- suppression de compte
function test9a()
    local status = 0;
    status = acc_del(url, clientId2, tokenSess1, clientId1) -- par un autre client
    lu.assertEquals(status, 403) 
end
function test9b()
    local status = 0;
    status = acc_del(url, clientId1, tokenSess1, clientId1) -- suppression par proprio
    lu.assertEquals(status, 200)
end
function test9c()
    local status = 0;
    status = acc_del(url, clientId2, tokenSessAdmin, adminId) --suppression par admin
    lu.assertEquals(status, 200)
end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )