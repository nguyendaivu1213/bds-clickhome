$path = "d:\OSPanel\home\bds-clickhome\admin\app\components\ProjectForm.tsx"
$content = Get-Content -Path $path -Encoding UTF8

$prefix = $content[0..583]
$middle1 = @'
                                  onChange={(e) => {
                                     const url = e.target.value;
                                     handleInputChange("googleMapLink", url);
                                     
                                     let lat, lng;
                                     const m1 = url.match(/@(-?[\d.]+),(-?[\d.]+)/);
                                     if (m1) { lat = m1[1]; lng = m1[2]; }
                                     
                                     if (!lat || !lng) {
                                       const m2 = url.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
                                       if (m2) { lat = m2[1]; lng = m2[2]; }
                                     }
                                     
                                     if (!lat || !lng) {
                                       const m3 = url.match(/[?&]q=(-?[\d.]+),(-?[\d.]+)/);
                                       if (m3) { lat = m3[1]; lng = m3[2]; }
                                     }

                                     if (lat && lng) { 
                                       handleInputChange("latitude", lat); 
                                       handleInputChange("longitude", lng); 
                                     }
                                  }}
'@
$between = $content[590..614]
$suffix = $content[625..($content.Count-1)]

$newContent = @()
$newContent += $prefix
$newContent += $middle1
$newContent += $between
$newContent += $suffix

$newContent | Set-Content -Path $path -Encoding UTF8
