from PIL import Image
import os

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
        # Check if the pixel is white-ish (high R, G, B)
        # item is (R, G, B, A)
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0)) # fully transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

for img_name in images:
    in_path = os.path.join("public", img_name)
    out_path = os.path.join("public", img_name.rsplit('.', 1)[0] + "_transparent.png")
    if os.path.exists(in_path):
        remove_white_bg(in_path, out_path)
