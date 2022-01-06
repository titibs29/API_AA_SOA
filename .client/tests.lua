--executer avec ctrl+shift+b ou via terminal > executer la tache > run lua
--#region appel à la librairie socket locale
package.path = package.path..';./.client/libs/lua/?.lua'
package.cpath = package.cpath..';./.client/libs/socket/?.dll;./libs/mime/?.dll'

local http = require 'socket.http'
local mime = require 'mime'
local ltn12 = require 'ltn12'
local json = require 'json'
local acc = require 'acc'
local store = require 'store'
local pi = require 'pi'
local booking = require 'booking'
--#endregion


local url = 'http://localhost:3000' --url a appeler

local clientId1 = 'nil';
local clientId2 = 'nil';
local adminId = 'nil';
local tokenSess1 = 'nil';
local tokenSess2 = 'nil';
local tokenSessAdmin = 'nil';

-- connexion
function connect(url)
    local body, statuscode, headers, statustext = http.request(url)
    return statuscode
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

    end


    -- création de deux compte clients
    function TestAccount:test1a()
        local status = 0;
        status, clientId1 = acc.create(url, "luacreate", "luapassword" );
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
    end
    function TestAccount:test1b()
        local status = 0;
        status, clientId2 = acc.create(url, "luasecond", "secondpass");
        lu.skipIf(status == 400, "le compte existe");
        lu.assertEquals( status, 201);
        
    end


    -- creation de 3 sessions
    function TestAccount:test2a()
        local status = 0;
        status, adminId, tokenSessAdmin = acc.login(url, "admin", "admin" ); -- session admin
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2b()
        local status = 0;
        status, clientId1, tokenSess1 = acc.login(url, "luacreate", "luapassword" ); -- session client 1
        lu.assertEquals( status, 200);
    end
    function TestAccount:test2c()
        local status = 0;
        status, clientId2, tokenSess2 = acc.login(url, "luasecond", "secondpass" ); -- session client 2
        lu.assertEquals( status, 200);
    end


    -- affiche l'utilisateur
    function TestAccount:test3a()
        local status = 0;
        local name = 'nil';
        status, name = acc.showOne(url, tokenSess1, clientId1); -- par son proprio
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end
    function TestAccount:test3b()
        local status = 0;
        local name = 'nil';
        status, name = acc.showOne(url, tokenSess2, clientId1); -- par un autre client
        lu.assertEquals(status, 403);
        lu.assertEquals(name, 'nil');
        
    end
    function TestAccount:test3c()
        local status = 0;
        local name = 'nil';
        status, name = acc.showOne(url, tokenSessAdmin, clientId1); -- par un admin
        lu.assertEquals(status, 200);
        lu.assertEquals(name, "luacreate");
        
    end

    -- modification d'un compte
    function TestAccount:test4a()
        local status = 0;
        local statusTwo = 0;
        local name = 'nil';
        local role = 3;
        status = acc.modify(url,tokenSess1, clientId1, "newname", "newPass",1); -- par son proprio
        statusTwo, name, role = acc.showOne(url, tokenSess1, clientId1) -- on verifie
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newname");
        lu.assertEquals(role, 2);
    end
    function TestAccount:test4b()
        local status = 0;
        status = acc.modify(url,tokenSess1, clientId2, "newname", "newPass",1); -- par un autre client
        lu.assertEquals(status, 403);
    end
    function TestAccount:test4c()
        local status = 0;
        local statusTwo = 0;
        local name = 'nil';
        local role = 3;
        status = acc.modify(url,tokenSessAdmin, clientId1, "newnametwo", "newPasstwo",1); -- par un admin
        statusTwo, name, role = acc.showOne(url, tokenSess1, clientId1) -- on verifie
        lu.assertEquals(status, 200);
        lu.assertEquals(statusTwo, 200);
        lu.assertEquals(name, "newnametwo");
        lu.assertEquals(role, 1);
    end
    


    -- affichage de toute la base
    function TestAccount:test5a()
        local status = 0;
        status = acc.showAll(url, tokenSess1); -- avec un compte client
        lu.assertEquals(status, 403);
    end
    function TestAccount:test5b()
        local status = 0;
        status = acc.showAll(url, tokenSessAdmin); -- avec un compte admin
        lu.assertEquals(status, 200);
    end


-- suppression de compte
function test9a()
    local status = 0;
    status = acc.del(url, clientId2, tokenSess1, clientId1) -- par un autre client
    lu.assertEquals(status, 403) 
end
function test9b()
    local status = 0;
    status = acc.del(url, clientId1, tokenSess1, clientId1) -- suppression par proprio
    lu.assertEquals(status, 200)
end
function test9c()
    local status = 0;
    status = acc.del(url, clientId2, tokenSessAdmin, adminId) --suppression par admin
    lu.assertEquals(status, 200)
end



    
local runner = lu.LuaUnit.new()
runner:setOutputType("text")
os.exit( runner:runSuite() )