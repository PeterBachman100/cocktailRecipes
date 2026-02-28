import { Star } from 'lucide-react';
import { useState } from 'react';

const StarRating = ({ 
    value = 0, 
    onChange, 
    isEditable = false, 
    size = 16,
}) => {
    const [hover, setHover] = useState(0);

    const handleClick = (rating) => {
        if (isEditable && onChange) {
            if(value === rating) onChange(0);
            else onChange(rating);
        }
    };

    return (
        <div className={`StarRating_container ${isEditable ? 'is-editable' : 'is-readonly'}`}>            
            <div className="StarRating_stars">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = (hover || value) >= star;
                    
                    return (
                        <Star
                            key={star}
                            size={size}
                            fill={isActive ? "var(--color-accent)" : "transparent"}
                            stroke={isActive ? "var(--color-accent)" : "var(--color-border)"}
                            className="StarRating_icon"
                            onMouseEnter={() => isEditable && setHover(star)}
                            onMouseLeave={() => isEditable && setHover(0)}
                            onClick={() => handleClick(star)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StarRating;