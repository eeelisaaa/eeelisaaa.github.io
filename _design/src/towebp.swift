import Foundation
import ImageIO
import CoreGraphics
import UniformTypeIdentifiers
// Usage: towebp <in.png> <out.webp> <maxHeight> <quality 0-1>
let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!
let img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
let maxH = CGFloat(Int(a[3]) ?? 900); let q = Double(a[4]) ?? 0.8
let s = min(1, maxH / CGFloat(img.height))
let w = Int(CGFloat(img.width) * s), h = Int(CGFloat(img.height) * s)
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
let scaled = ctx.makeImage()!
let type = UTType("public.avif")!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, type.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, scaled, [kCGImageDestinationLossyCompressionQuality: q] as CFDictionary)
print(CGImageDestinationFinalize(dest) ? "ok \(w)x\(h)" : "fail")
