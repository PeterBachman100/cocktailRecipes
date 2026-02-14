import { useState } from 'react';
import Badge from './Badge';

const BadgeList = ({ items, type, compact }) => {

    if (compact === 'false') return (
        <div className='BadgeList_root'>
            {items.map((item) => (
                <Badge key={item} type={type}>{item}</Badge>
            ))}
        </div>
    );

    const [isExpanded, setIsExpanded] = useState(false);

    const limit = type === 'spirit' ? 3 : 4;
    const hasOverflow = items.length > limit;
    const showAll = isExpanded || !hasOverflow;

    const displayedItems = showAll ? items : items.slice(0, limit);
    const overflowCount = items.length - limit;

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