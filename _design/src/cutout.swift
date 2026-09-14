import Foundation
import Vision
import CoreImage

// Usage: cutout <in> <out.png> <maxDim>
let a = CommandLine.arguments
let inURL = URL(fileURLWithPath: a[1]); let outURL = URL(fileURLWithPath: a[2]); let maxDim = CGFloat(Int(a[3]) ?? 1400)
guard let img = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else { print("cannot read"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: img, options: [:])
try handler.perform([req])
guard let res = req.results?.first else { print("no foreground"); exit(2) }
let buf = try res.generateMaskedImage(ofInstances: res.allInstances, from: handler, croppedToInstancesExtent: true)
var out = CIImage(cvPixelBuffer: buf)
let s = min(1, maxDim / max(out.extent.width, out.extent.height))
out = out.transformed(by: CGAffineTransform(scaleX: s, y: s))
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: outURL, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok \(Int(out.extent.width))x\(Int(out.extent.height))")
