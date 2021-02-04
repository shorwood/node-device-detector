const fs = require('fs');
const Table = require('cli-table');
const YAML = require('js-yaml');

/**
 * @param fixture
 * @param result
 */
function perryTable(fixture, result) {
  if (!(process.env.DEBUG_TABLE && process.env.DEBUG_TABLE === 'true')) {
	return;
  }
  
  try {
	console.log('UserAgent \x1b[33m%s\x1b[0m', fixture.user_agent);
	const table = new Table({
	  head: ['Result', 'Fixture'],
	  colWidths: [50, 50]
	});
	table.push([
	  perryJSON(result),
	  perryJSON(fixture)
	]);
	console.log(table.toString());
	
  } catch (e) {
	throw new SyntaxError(e.stack);
  }
}

function revertKeysForObjects(items){
  return Object.assign({}, ...Object.entries(items).map(([a, b]) => ({[b]: a})), {});
}

function YAMLLoad(yamlPath) {
  return YAML.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
}

function perryJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function isObjNotEmpty(value) {
  return value !== void 0 && value !== null;
}

function normalizeVersion(version, count) {
  if (version === '' || version === null) {
	return ''
  }
  let versionParts = String(version).split(/\./);
  let versionPartsCount = versionParts.length;
  if (versionPartsCount === 1 && versionParts[0] === '') {
	return null;
  }
  while (versionPartsCount < count) {
	versionParts.push('0');
  }
  if (versionPartsCount > 0 && versionPartsCount < count) {
	version = versionParts.slice(0, count).join('.');
  }
  return version;
}

module.exports = {
  YAMLLoad,
  revertKeysForObjects,
  normalizeVersion,
  perryTable,
  perryJSON,
  isObjNotEmpty
};