import { Truck, RotateCcw, Headphones, Zap } from "lucide-react";
export default function Above() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-gray-600" />,
      title: "Giao hàng siêu tốc",
      description: "Nội thành TP.HCM chỉ trong 30 phút",
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-gray-600" />,
      title: "Đổi món dễ dàng",
      description: "Miễn phí đổi món trong vòng 15 phút",
    },
    {
      icon: <Headphones className="w-8 h-8 text-gray-600" />,
      title: "Hỗ trợ tức thì",
      description: "Hỗ trợ khách hàng 24/7",
    },
    {
      icon: <Zap className="w-8 h-8 text-gray-600" />,
      title: "Deal hot bùng nổ",
      description: "Giảm giá sốc mỗi ngày",
    },
  ];

  return (
    <section className="mx-auto max-w-[1400px] mb-[20px] mt-[20px]">
      <div className="py-12 px-4">
        <div className="grid md:grid-cols-4  grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex space-x-4 bg-white p-4 md:w-[300px] md:h-[150px] h-[150px] items-center rounded-md"
            >
              <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
