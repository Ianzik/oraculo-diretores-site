// Serve os arquivos deste repositório em ianinglez.com/oraculo
// ianinglez.com/oraculo/              -> index.html (o app)
// ianinglez.com/oraculo/apresentacao/ -> apresentacao/index.html
const PREFIXO = "/oraculo";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let caminho = url.pathname;

    if (caminho === PREFIXO) {
      return Response.redirect(url.origin + PREFIXO + "/" + url.search, 301);
    }
    if (caminho.startsWith(PREFIXO + "/")) caminho = caminho.slice(PREFIXO.length);

    // Nunca entrega arquivos internos (.git, configuração, este script)
    if (/(^|\/)\./.test(caminho) || /^\/(worker\.js|wrangler\.jsonc)$/.test(caminho)) {
      return new Response("Não encontrado", { status: 404 });
    }

    const resposta = await env.ASSETS.fetch(
      new Request(new URL(caminho + url.search, url.origin), request)
    );

    const cabecalhos = new Headers(resposta.headers);
    const destino = cabecalhos.get("Location");
    if (destino) {
      const alvo = new URL(destino, url.origin);
      if (alvo.origin === url.origin && !alvo.pathname.startsWith(PREFIXO + "/")) {
        cabecalhos.set("Location", PREFIXO + alvo.pathname + alvo.search);
      }
    }
    // Fora do Google: tem dado interno de curadoria
    cabecalhos.set("X-Robots-Tag", "noindex, nofollow");

    return new Response(resposta.body, { status: resposta.status, headers: cabecalhos });
  },
};
