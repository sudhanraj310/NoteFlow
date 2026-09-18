param(
    [int]$Port = 8080
)

$projectRoot = Split-Path -Parent $PSCommandPath
$backendDirectory = Join-Path $projectRoot "backend"
$maven = Get-Command mvn -ErrorAction SilentlyContinue

if (-not $maven) {
    throw "Maven is required for this launcher. Install Maven or run 'docker compose up --build' from the NoteFlow folder."
}

$previousPort = $env:PORT
try {
    $env:PORT = $Port
    Push-Location $backendDirectory
    & $maven.Source -B -DskipTests package
    if ($LASTEXITCODE -ne 0) { throw "The NoteFlow build failed." }
    & java -jar (Join-Path $backendDirectory "target\noteflow-backend-1.0.0.jar")
}
finally {
    Pop-Location -ErrorAction SilentlyContinue
    $env:PORT = $previousPort
}
