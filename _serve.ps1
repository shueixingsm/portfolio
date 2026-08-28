# Minimal static file server (zero dependencies) — for local preview only
$prefix = "http://localhost:8137/"
$root = "E:\AG\Project\Z_project\Za\Deliverables\cg-portfolio"
$mimes = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"; ".json" = "application/json"
  ".jpg"  = "image/jpeg"; ".jpeg" = "image/jpeg"; ".png" = "image/png"
  ".webp" = "image/webp"; ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"
  ".mp4"  = "video/mp4"; ".webm" = "video/webm"; ".woff2" = "font/woff2"
  ".woff" = "font/woff"; ".txt" = "text/plain; charset=utf-8"
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      $path = $ctx.Request.Url.AbsolutePath
      if ($path -eq "/") { $path = "/index.html" }
      $file = Join-Path $root ($path -replace "/", "\")
      if ((Test-Path $file -PathType Leaf) -and ($file.StartsWith($root))) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $mime = $mimes[$ext]; if (-not $mime) { $mime = "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ctx.Response.ContentType = $mime
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 not found")
        $ctx.Response.ContentLength64 = $msg.Length
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
      }
    } catch { Write-Host "req error: $_" }
    finally { $ctx.Response.OutputStream.Close() }
  }
} finally { $listener.Stop() }
