import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image


themes_and_palettes = {
    "nature": ["#556B2F", "#8FBC8F", "#2E8B57", "#3CB371", "#66CDAA"],
    "abstract": ["#FF6347", "#FFD700", "#4682B4", "#6A5ACD", "#FF69B4"],
    "urban": ["#708090", "#A9A9A9", "#778899", "#2F4F4F", "#C0C0C0"],
    "portrait": ["#FAEBD7", "#D2B48C", "#FFE4C4", "#8B4513", "#A0522D"],
    "fantasy": ["#9370DB", "#8A2BE2", "#4B0082", "#7B68EE", "#9932CC"],
    "modern": ["#B0C4DE", "#4682B4", "#5F9EA0", "#87CEEB", "#708090"],
    "historical": ["#CD853F", "#8B4513", "#A0522D", "#D2691E", "#F4A460"],
    "vintage": ["#D3B8AE", "#D7B19A", "#9E7C3C", "#C0977D", "#3B2F2F"],
    "minimalist": ["#E8E8E8", "#F4F4F4", "#A8A8A8", "#2F4F4F", "#D3D3D3"],
    "romantic": ["#F8BBD0", "#F5B7B1", "#F1948A", "#F39C12", "#E74C3C"],
    "techno": ["#00FFFF", "#8A2BE2", "#5F9EA0", "#00BFFF", "#7FFFD4"],
    "retro": ["#FF6347", "#F0E68C", "#FFD700", "#FF69B4", "#9ACD32"],
    "gothic": ["#2F4F4F", "#800000", "#8B0000", "#2C3539", "#5D4037"],
    "bohemian": ["#7E4B3C", "#B49B6A", "#FF6347", "#2A9D8F", "#D4A5A5"],
    "art_deco": ["#D4AF37", "#800080", "#E4B7B7", "#B9A7A0", "#7A6A3E"],
    "scifi": ["#00FFFF", "#FF00FF", "#8B008B", "#32CD32", "#FFD700"],
    "baroque": ["#4B0082", "#8A2BE2", "#8B4513", "#FFD700", "#C71585"],
    "renaissance": ["#D2B48C", "#8B4513", "#A0522D", "#F4A460", "#FFE4C4"],
    "psychedelic": ["#FF00FF", "#FF6347", "#00FFFF", "#FFD700", "#B22222"],
    "eclectic": ["#B0E0E6", "#D3D3D3", "#8B0000", "#A52A2A", "#32CD32"],
    "futuristic": ["#008080", "#B0E0E6", "#1E90FF", "#C71585", "#FFD700"]
}


processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32", from_tf=True)


def classify_image_theme_and_palette(image_path):
    
    image = Image.open(image_path).convert("RGB")
    
    
    themes = list(themes_and_palettes.keys())
    inputs = processor(text=themes, images=image, return_tensors="pt", padding=True)

    
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image 
        probs = logits_per_image.softmax(dim=1) 

    
    best_theme_idx = probs.argmax().item()
    best_theme = themes[best_theme_idx]
    confidence = probs[0, best_theme_idx].item()

    
    color_palette = themes_and_palettes[best_theme]
    
    return best_theme, confidence, color_palette

# Example usage
image_path = "image.png"  
theme, confidence, palette = classify_image_theme_and_palette(image_path)

print(f"Detected Theme: {theme} (Confidence: {confidence * 100:.2f}%)")
print(f"Suggested Color Palette: {palette}")
