interface ProductCardProps {
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function ProductCard({ name, description, price, image, category }: ProductCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <div className="text-6xl text-primary-300">
            {image}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {category}
          </span>
          <span className="text-2xl font-bold text-text-primary">
            ${price.toLocaleString()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-text-secondary text-sm leading-relaxed">
          {description}
        </p>
        
        <button className="w-full btn-primary text-sm">
          Ver Detalles
        </button>
      </div>
    </div>
  )
}
