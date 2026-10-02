from PIL import Image
import os
import math

images = [
    "aws.png", "docker.png", "firebase.jpeg", "github.png", "git.png",
    "golang.jpeg", "java.png", "javascript.png", "kafka.png", "mongoDB.jpeg",
    "nodeJS.png", "pgSQL.png", "prisma.png", "react.png", "springboot.png"
]

def remove_white_bg(img_path, out_path):
    print(f"Processing {img_path}...")
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Distance from white
        r, g, b, a = item
        # If the pixel is completely transparent, keep it
        if a == 0:
            new_data.append(item)
            continue
            
        # Euclidean distance from pure white (255, 255, 255)
        dist = math.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
        
        # If distance is small (very close to white), make it transparent.
        # If distance is a bit larger, make it partially transparent to avoid halos.
        if dist < 10:
            new_data.append((255, 255, 255, 0))
        elif dist < 60:
            # Smooth transition for anti-aliasing pixels
            alpha = int(((dist - 10) / 50) * 255)
            # To avoid a white halo, we darken the pixel slightly by removing the white contribution
            # Or just keep the color but reduce alpha
            new_data.append((r, g, b, min(a, alpha)))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

for img_name in images:
    in_path = os.path.join("public", img_name)
    out_path = os.path.join("public", img_name.rsplit('.', 1)[0] + "_transparent.png")
    if os.path.exists(in_path):
        remove_white_bg(in_path, out_path)
