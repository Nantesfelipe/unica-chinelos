const jwt = require('jsonwebtoken')


//garantir que apenas usuários autenticados possam acessar determinadas rotas da API.
function autenticar(req,res,next){
    
    const authHeader = req.headers.authorization;
    //constante recebe o hedaer do JSON

    if (!authHeader){
        return res.status(401).json({erro:'Token não fornecido.'});
    }

    const [tipo, token] = authHeader.split(' ');
    //constante divide o array authHeader em 2 variaveis, split divide apos 1 espaco

    if(tipo !== 'Bearer' || !token){
        //Bearer = um tipo de autenticacao HTTP
        return res.status(401).json ({ erro: 'Formato de token inválido.'});
    }

    try{
        const dadosToken = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dadosToken;
        next();
    } catch{
        return res.status(401).json({erro:'Token inválido ou expirado'});
    }

}

function apenasAdmin(req,res,next){
    if(req.usuario.tipo !== 'admin'){
        return res.status(403).json({erro: 'Acesso restrito a administradores.'});
    }
    next(); //Se nao for um erro, apenas continue.
}

module.exports = { autenticar, apenasAdmin };

