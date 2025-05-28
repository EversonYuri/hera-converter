--ATUALIZA CAMPOS TABELA
-- update produotos set iat='A',ippt='T',alterado=',',custooperacional=0, fatorDeMultiplicacao =1,
-- fatorQtdUnd =0, quantidadeMaximaVenda =0, totalComprado =0,PRODUTOBALANCA=0,
-- estoquemaximo=0, produtoMultiLoja =0, alterarPrecoMultiLoja =0, pedeNumeroSerieVenda =0, pagaComissao =0,
-- limitarDesconto =0, finalidadeProduto =1, descricaoLivre =0, bloquearQuantidadeVenda =0,
-- quantidade =1, precoLivre =0, possuiSubItens =0, listaSubItens =0, produtograde =0,BALANCACAIXA=0,
-- etiqueta =0, estoqueminimo =0, balancacaixa =0,gradeprodutos=0,idunidadecompra=1,PESOBRUTO=0,PESOLIQUIDO=0,
-- percentualComissaoPrazo = 0.00, tipoComissao = 0, ultimaquantidadecomprada=0, 
-- valorComissaoPrazo = 0.00, valorComissaoVista = 0.00, percentualMaximoDesconto = 0,
-- dataUltimaCompra = NULL, horaAlteracao = NULL, idFamilia = NULL, dataAlteracao = NULL, alteradoMultiLoja = ',', codigointerno = id,
-- percentualComissao = 0, produtoGrade = NULL, quantidadePorUnd = 1, produtoInativo =0;

--VERIFICA VALORES
-- UPDATE produotos SET VALORCOMPRA=VALORCUSTO WHERE valorCompra = 0 OR valorCompra IS NULL;
-- UPDATE produotos SET valorVenda=valorcusto WHERE valorvenda IS NULL OR valorVenda < valorCusto;
-- UPDATE produotos SET valorVenda=0.01 WHERE valorvenda IS NULL OR valorvenda = 0.00;
-- UPDATE produotos SET valorVendaAtacado=0.01 WHERE valorvendaAtacado IS NULL OR valorvendaAtacado = 0.00;
-- UPDATE produotos SET valorVendaEtiqueta = valorvenda;
-- UPDATE produotos SET valorCusto = valorvenda WHERE valorcusto > valorvenda OR valorcusto IS NULL;
-- UPDATE produotos SET valorCompra=0 WHERE valorcompra IS NULL;
-- UPDATE produotos SET gtin = referencia WHERE GTIN IS NULL OR gtin='';
-- UPDATE produotos SET gtin = TRIM(LEADING '0' FROM gtin);
-- UPDATE produotos SET gtin = referencia WHERE GTIN IS NULL OR gtin='';

--TRATAMENTO DE CODIGO DE BARRAS
-- UPDATE produotos SET gtin = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(gtin,'A',''),'B',''),'C',''),'D', ''),'E', ''),'F', ''),'G', ''),'H', ''),'I', ''),'J', ''),'K', ''),'L', ''),'M', ''),'N', ''),'O', ''),'P', ''),'Q', ''),'R', ''),'S', ''),'T', ''),'U', ''),'V', ''),'W', ''),'X', ''),'Y', ''),'Z', '');
-- update produotos set gtin = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(gtin,'a',''),'b',''),'c',''),'d', ''),'e', ''),'f', ''),'g', ''),'h', ''),'i', ''),'j', ''),'k', ''),'l', ''),'m', ''),'n', ''),'o', ''),'p', ''),'q', ''),'r', ''),'s', ''),'t', ''),'u', ''),'v', ''),'w', ''),'x', ''),'y', ''),'z', '');
-- UPDATE produotos SET gtin = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(gtin,'Á',''),'É',''),'Í',''),'Ó', ''),'Ú', ''),'á', ''),'é', ''),'í', ''),'ó', ''),'ú', ''),'Â', ''),'Ê', ''),'Ô', ''),'â', ''),'ê', ''),'ô', ''),'À', ''),'à', ''),'Ü', ''),'ü', ''),'Ç', ''),'ç', ''),'Ñ', ''),'ñ', ''),'Ã', ''),'Õ', '');
-- UPDATE produotos SET gtin = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(gtin,'õ',''),'ä',''),'ë',''),'ï', ''),'ö', ''),'ü', ''),'ÿ', ''),'Ä', ''),'Ë', ''),'Ï', ''),'Ö', ''),'Ü', ''),'Ÿ', ''),'å', ''),'Å', ''),'æ', ''),'Æ', ''),'œ', ''),'Œ', ''),'.', ''),'|', ''),' ', ''),',', ''),'!', ''),'@', ''),'/', '');
-- UPDATE produotos SET gtin = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(gtin,'ã',''),'-',''),'-',''),'%', ''),'$', ''),'¨', ''),'&', ''),'*', ''),'(', ''),')', ''),'+', ''),'=', ''),'§', ''),':', ''),';', ''),'?', ''),'¿', ''),'�', ''),'^', ''),'~', ''),'{', ''),'}', ''),'´', ''),'`', ''),'_', ''),'º', '');
-- UPDATE produotos SET gtin = REPLACE(REPLACE(REPLACE(gtin,'[',''),']',''),'¬','');

--COLOCA GTIN ETIQUETAS
-- UPDATE produotos SET GTINETIQUETAS = GTIN;

--ZERO A ESQUERDA
-- update produotos set codigoncm= concat('0',codigoncm) where length (codigoncm)<8;

--ATUALIZA NCM DOS PRODUTOS COM NCM QUE NAO EXISTEM NA TABELA DO HERA
-- UPDATE produotos AS p SET codigoncm = '62046300' WHERE codigoncm IS NULL or LENGTH(codigoncm)<=7 or LENGTH(codigoncm)>=9 or codigoNCM = '00000000';

--ATUALIZA TABELA CEST PARA OS NCM EXISTENTES
-- UPDATE produotos SET codigocest=concat('0',codigocest) WHERE length(codigocest)<7;

-- UPDATE produotos AS p SET codigocest = '' WHERE codigocest IS NULL or LENGTH(codigocest)<=6 or LENGTH(codigocest)>=8 or codigoCEST = '0000000';

--VERIFICA SE EXISTE GTIN DUPLICADO
-- SELECT distinct id,referencia,gtin,gtintributavel FROM produotos GROUP by gtin having count(*) > 1;

--ATUALZIA NOME E ADICIONA CODIGO INTERNO
-- UPDATE produotos SET nome = CONCAT(nome,' ',codigoInterno) WHERE EXISTS (SELECT nome FROM(SELECT nome FROM produotos)  
-- AS tmpb WHERE produotos.nome = tmpb.nome GROUP BY nome HAVING COUNT(nome) > 1);

--ATUALIZA PRODUTO BALANCA
-- UPDATE produotos SET balancacaixa=1,produtobalanca=1 where idunidade=2

--VERIFICA ESTOQUE
-- update produotos set estoqueatual=0 where estoqueatual is null or estoqueatual < -999999 or estoqueatual > 999999;

--ATUALIZAR MARKUP
-- UPDATE PRODUOTOS SET MARKUP = ((valorVenda / Round(valorCusto,2)) * 100) - 100 WHERE valorCusto != 0;
-- UPDATE PRODUOTOS SET MARKUP = 0 WHERE MARKUP IS NULL OR MARKUP = 0;
-- UPDATE PRODUOTOS SET MARKUPATACADO = ((valorVendaAtacado / Round(valorCusto,2)) * 100) - 100 WHERE valorCusto != 0;
-- UPDATE PRODUOTOS SET MARKUPATACADO = 0 WHERE MARKUPATACADO IS NULL OR MARKUP = 0;

--ATUALIZAR CUSTO OPERACIONAL
-- UPDATE PRODUOTOS SET custooperacional = ((valorCusto / Round(valorCompra,2)) * 100) - 100 WHERE valorcusto != valorcompra AND valorCOmpra !=0;
-- UPDATE PRODUOTOS SET custooperacional = 0 WHERE custooperacional IS NULL OR custooperacional = 0;

--VERIFICAÇÕE BASICAS
-- UPDATE produotos SET idUnidade = 1 WHERE idUnidade IS NULL OR idUnidade = 0;
-- UPDATE produotos SET idFiscal = 1 WHERE idFiscal IS NULL OR idFiscal = 0;
-- UPDATE produotos SET idFornecedor = 1 WHERE idFornecedor IS NULL OR idFornecedor = 0;
-- UPDATE produotos SET idGrupo = 1 WHERE idGrupo IS NULL OR idGrupo = 0;
-- UPDATE produotos SET idSetor = 1 WHERE idSetor IS NULL OR idSetor = 0;
-- UPDATE produotos SET idSubGrupo = 1 WHERE idSubGrupo IS NULL OR idSubGrupo = 0;

--PEGA O CAMPO OBSERVACAO E TRANSFORMA EM SETOR
-- INSERT INTO setores(nome,excluido,idmatriz) SELECT UPPER(observacao), 0, 1 FROM produotos p WHERE p.observacao IS NOT NULL GROUP BY observacao;
-- UPDATE PRODUOTOS AS P INNER JOIN SETORES AS S ON P.observacao=S.nome SET P.IDSETOR=S.ID;
-- --PEGA O CAMPO DESCRICAOPDV E TRANSFORMA EM GRUPO
-- INSERT INTO grupos(nome,excluido,idmatriz) SELECT UPPER(descricaoPDV), 0, 1 FROM produotos WHERE descricaoPDV IS NOT NULL GROUP BY descricaoPDV;
-- UPDATE PRODUOTOS AS P INNER JOIN GRUPOS AS S ON P.descricaoPDV=S.NOME SET P.IDGRUPO=S.ID;
-- --PEGA O CAMPO DESCRICAOETIQUETAS E TRANSFORMA EM SUBGRUPO
-- INSERT INTO subgrupos(nome,excluido,idmatriz) SELECT UPPER(descricaoEtiquetas), 0, 1 FROM produotos WHERE descricaoEtiquetas IS NOT NULL GROUP BY descricaoEtiquetas;
-- UPDATE PRODUOTOS AS P INNER JOIN SUBGRUPOS AS S ON P.descricaoEtiquetas=S.NOME SET P.IDSUBGRUPO=S.ID;

--ATUALIZA NOME
-- UPDATE produotos SET nome = trim(UPPER(nome)), descricaopdv = nome, descricaoetiquetas = nome;

-- historicoatualizacoesprodutos
-- INSERT INTO historicoatualizacoesprodutos (alteradoEm, custoOperacionalAnterior, custoOperacionalAtual, dataHoraAlteracao, estoqueAnterior, estoqueAtual, margemAnterior, margemAtual, primeiroCadastro, valorCompraAnterior, valorCompraAtual, valorCustoAnterior, valorCustoAtual, valorVendaAnterior, valorVendaAtual, idProduto, idUsuario, margemAnteriorAtacado, valorVendaAnteriorAtacado)
-- SELECT 
--     'Conversao de Banco de Dados',
--     custoOperacional,
--     custoOperacional,
--     NOW(),
--     estoqueAtual,
--     estoqueAtual,
--     markup,
--     markup,
--     1,
--     valorCompra,
--     valorCompra,
--     valorCusto,
--     valorCusto,
--     valorVenda,
--     valorVenda,
--     id,
--     1,
--     markUpAtacado,
--     valorVendaAtacado
-- FROM 
--     produotos;
    
    
--     -- historicomovimentacaoEstoque
-- INSERT INTO historicomovimentacaoEstoque (dataHoraMovimentacao, estoqueAtual, tipoMovimentacao, idProduto, idOperacao)
-- SELECT NOW(), estoqueAtual, 0, id, 1
-- FROM produotos;