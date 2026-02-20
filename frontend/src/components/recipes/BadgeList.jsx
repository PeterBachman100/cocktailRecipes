import { useState } from 'react';
import Badge from './Badge';

const BadgeList = ({ items, type, compact }) => {

    const whiskeyVariations = ['bourbon', 'rye', 'scotch'];
    const hasSpecificWhiskey = items.some(item => whiskeyVariations.includes(item));
    const filteredItems = items.filter((item) => {
        if (hasSpecificWhiskey && item === 'whiskey') return false;
        return true;
    });

    if (compact === 'false') return (
        <div className='BadgeList_root'>
            {filteredItems.map((item) => (
                <Badge key={item} type={type}>{item}</Badge>
            ))}
        </div>
    );

    const [isExpanded, setIsExpanded] = useState(false);

    const limit = type === 'spirit' ? 3 : 5;
    const hasOverflow = filteredItems.length > limit;
    const showAll = isExpanded || !hasOverflow;

    const displayedItems = showAll ? filteredItems : filteredItems.slice(0, limit);
    const overflowCount = filteredItems.length - limit;

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`BadgeList_root ${isExpanded ? 'BadgeList_root--expanded' : ''}`}>
            
            {displayedItems.map((item) => (
                <Badge key={item} type={type}>{item}</Badge>
            ))}

            {hasOverflow && (
                <Badge type='ghost' onClick={handleToggle}>
                    {isExpanded ? 'Show Less' : `+${overflowCount}`}
                </Badge>
            )}
        </div>
    );
};

export default BadgeList;