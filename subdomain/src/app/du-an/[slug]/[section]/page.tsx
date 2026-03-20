"use client";

import { use, useEffect, useState } from "react";
import { fetchProject, Project } from "@/lib/api";

export default function ProjectSectionPage({
    params,
}: {
    params: Promise<{ slug: string; section: string }>;
}) {
    const { slug, section } = use(params);
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProject(slug).then((data) => {
            setProject(data);
        });
    }, [slug]);

    const projectName = project?.name || slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    switch (section) {
        case "tong-quan":
            const slideMedia = project?.slide_images || [];
            const displayImages = slideMedia.length > 0
                ? slideMedia.map(s => s.image_url || s.image)
                : [
                    "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-2.jpg",
                    "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-1.jpg",
                    "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/location/img-1.jpg",
                    "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-4.jpg",
                    "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-3.jpg",
                ];

            return (
                <section className="py-16 bg-white min-h-screen border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column: Image Gallery */}
                            <div className="lg:col-span-6">
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-sm shadow-md aspect-video">
                                        <img
                                            src={displayImages[0]}
                                            alt={projectName}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {displayImages.slice(1, 5).map((img, idx) => (
                                            <div key={idx} className="aspect-square overflow-hidden rounded-sm shadow-sm cursor-pointer border border-gray-100 bg-gray-50">
                                                <img
                                                    src={img}
                                                    alt={`${projectName} thumb ${idx + 1}`}
                                                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Detailed Info */}
                            <div className="lg:col-span-6">
                                <h2 className="text-3xl font-bold mb-8 text-gray-800 uppercase tracking-tight leading-tight">
                                    TỔNG QUAN DỰ ÁN <br />
                                    <span className="text-[#e2cb83]">{projectName}</span>
                                </h2>

                                <div className="space-y-5 text-[15px]">
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Chủ đầu tư:</span>
                                        <span className="text-gray-600">Công ty Cổ phần Đầu Tư Và Phát Triển Đô Thị Sài Đồng (Thành viên của Vingroup)</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Tổng diện tích đất dự án:</span>
                                        <span className="text-gray-600">17.6 ha</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Mật độ xây dựng:</span>
                                        <span className="text-gray-600">31%</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Quy mô phát triển:</span>
                                        <span className="text-gray-600">3 tòa căn hộ & 364 căn nhà ở thấp tầng</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 h-auto text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Loại hình phát triển:</span>
                                        <span className="text-gray-600">
                                            Cao tầng (The Arcadia): 1PN, 2PN, 3PN, 4PN, Duplex <br />
                                            Thấp tầng (The Botanica): Biệt thự đơn lập, biệt thụ song lập, liền kề, shophouse
                                        </span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Thời điểm khởi công:</span>
                                        <span className="text-gray-600">Năm 2015</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Thời điểm bàn giao:</span>
                                        <span className="text-gray-600">Tháng 11/2017</span>
                                    </div>
                                    <div className="flex border-b border-gray-50 pb-3 text-sm">
                                        <span className="w-48 flex-shrink-0 font-bold text-gray-700">Hình thức sở hữu:</span>
                                        <span className="text-gray-600 font-medium font-bold">Sổ đỏ lâu dài</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        case "vi-tri":
            return (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Vị trí đắc địa</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>
                        <div className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15673.493902307519!2d106.8373!3d10.8443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521a00ba8dddd%3A0xe54ef8f20bafda40!2sVinhomes%20Grand%20Park!5e0!3m2!1sen!2svn!4v1628131235123!5m2!1sen!2svn"
                                width="100%"
                                height="500"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </section>
            );
        case "layout":
            return (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Mặt bằng & Layout</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="border border-gray-200 p-4 rounded-custom text-center">
                                <h3 className="font-bold text-lg mb-4">Layout 2 Phòng Ngủ</h3>
                                <img
                                    src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/apartment/img-3.jpg"
                                    alt="Layout 2PN"
                                    className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                                />
                            </div>
                            <div className="border border-gray-200 p-4 rounded-custom text-center">
                                <h3 className="font-bold text-lg mb-4">Layout 3 Phòng Ngủ</h3>
                                <img
                                    src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/apartment/img-4.jpg"
                                    alt="Layout 3PN"
                                    className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            );
        case "tien-do":
            return (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Tiến độ dự án</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <img src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-1.jpg" className="w-full h-64 object-cover rounded-custom shadow-sm" alt="Tiến độ 1" />
                            <img src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-2.jpg" className="w-full h-64 object-cover rounded-custom shadow-sm" alt="Tiến độ 2" />
                            <img src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-3.jpg" className="w-full h-64 object-cover rounded-custom shadow-sm" alt="Tiến độ 3" />
                        </div>
                    </div>
                </section>
            );
        default:
            return (
                <section className="py-20 bg-white text-center">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">{section.replace('-', ' ')}</h2>
                        <div className="w-16 h-1 bg-[#e2cb83] mx-auto mb-8"></div>
                        <p className="text-gray-500 italic">Nội dung đang được cập nhật cho dự án này...</p>
                    </div>
                </section>
            );
    }
}
