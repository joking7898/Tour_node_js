const SparqlClient = require('sparql-http-client')
 
// const endpointUrl = 'https://query.wikidata.org/sparql'
const endpointUrl = 'http://data.visitkorea.or.kr/sparql'
const query = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
 
SELECT ?value WHERE {
  wd:Q243 p:P2048 ?height.
 
  ?height pq:P518 wd:Q24192182;
    ps:P2048 ?value .
}`
var test1 ="심층수"
const query1 = `
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX vi: <http://www.saltlux.com/transformer/views#>
  PREFIX kto: <http://data.visitkorea.or.kr/ontology/>
  PREFIX ktop: <http://data.visitkorea.or.kr/property/>
  PREFIX ids: <http://data.visitkorea.or.kr/resource/>
  PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX geo: <http://www.saltlux.com/geo/property#>
  PREFIX pf: <http://www.saltlux.com/DARQ/property#> 
  SELECT DISTINCT ?description WHERE {
    ?resource a kto:Place ;
        dc:description ?description;
        foaf:depiction ?depiction;
        rdfs:label ?name.
        FILTER (contains(?name,"` +test1+`") ) 
  } limit 100
`

async function main () {
  const client = new SparqlClient({ endpointUrl })
  const stream = await client.query.select(query1)
 
  stream.on('data', row => {
    Object.entries(row).forEach(([key, value]) => {
      console.log(`${key}: ${value.value} (${value.termType})`)
    })
  })
 
  stream.on('error', err => {
    console.error(err)
  })
}
 
main()