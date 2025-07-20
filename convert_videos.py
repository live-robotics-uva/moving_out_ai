import os
import glob
from pathlib import Path

from moviepy import VideoFileClip


def convert_video_to_h264(input_path, output_path):
    """将视频转换为h264格式，优化网页播放"""
    try:
        print(f"正在转换: {os.path.basename(input_path)}")
        
        # 加载视频
        clip = VideoFileClip(input_path)
        
        # 转换为h264格式，优化网页播放
        clip.write_videofile(
            output_path,
            codec='libx264',           # 使用h264编码
            audio_codec='aac',         # 音频使用aac编码
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            preset='medium',           # 编码预设
            ffmpeg_params=['-crf', '23', '-movflags', '+faststart']  # 优化网页播放
        )
        
        # 释放资源
        clip.close()
        
        print(f"✓ 转换成功: {os.path.basename(input_path)}")
        return True
        
    except Exception as e:
        print(f"✗ 转换失败: {os.path.basename(input_path)} - {str(e)}")
        return False

def main():
    # 设置输入和输出目录
    input_dir = "./static/videos/by_map"
    output_dir = "./static/videos/by_map_h264"
    
    # 创建输出目录
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # 获取所有MP4文件
    video_files = glob.glob(os.path.join(input_dir, "*.mp4"))
    
    print(f"找到 {len(video_files)} 个视频文件需要转换...")
    
    success_count = 0
    
    for video_file in video_files:
        filename = os.path.basename(video_file)
        output_path = os.path.join(output_dir, filename)
        
        # 如果输出文件已存在，跳过
        if os.path.exists(output_path):
            print(f"跳过已存在的文件: {filename}")
            continue
            
        if convert_video_to_h264(video_file, output_path):
            success_count += 1
    
    print(f"\n转换完成！成功转换 {success_count}/{len(video_files)} 个文件")
    print(f"新文件保存在: {output_dir}")

if __name__ == "__main__":
    main() 