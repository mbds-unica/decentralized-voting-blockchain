const fs = require("fs");
const path = require("path");

function deploymentFilePath(networkName) {
  return path.join(__dirname, "..", "deployments", `${networkName}.json`);
}

function saveDeployment(networkName, payload) {
  const filePath = deploymentFilePath(networkName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

function loadDeployment(networkName) {
  const filePath = deploymentFilePath(networkName);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return { filePath, data: parsed };
}

function assertMatchingEnv(name, expectedValue) {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") {
    return;
  }

  const actual = raw.trim();
  if (String(actual) !== String(expectedValue)) {
    throw new Error(
      `${name} mismatch: env has '${actual}' but deployment metadata has '${expectedValue}'`
    );
  }
}

module.exports = {
  saveDeployment,
  loadDeployment,
  assertMatchingEnv
};
